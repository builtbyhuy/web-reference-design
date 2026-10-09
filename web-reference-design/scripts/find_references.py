#!/usr/bin/env python3
"""Find task-relevant candidates from a reference library; Python 3.9+, stdlib only."""

import argparse
import copy
import json
import os
from pathlib import Path
import re
import sys
import unicodedata
from urllib.parse import urlparse


DEFAULT_CATALOG = Path(__file__).resolve().parents[1] / "references" / "catalog.json"
STOP_WORDS = set("a an and are as at be build can create do for from help i in is it make me my need of on or our please the this to use using want we with website websites web app application design project page pages giao dien lam cho mot cac cua va toi can dung trang thiet ke".split())
STOP_WORDS.update("existing needs work without only preserve already currently should would could will must keep just have has had about some also".split())
TASK_PHRASES = {
    "nen anh": "compress compression images", "giam dung luong": "compression performance",
    "cat anh": "crop images", "doi kich thuoc": "resize images",
    "phoi mau": "palette colors", "bang mau": "palette colors", "tuong phan": "contrast accessibility",
    "phoi chu": "typography pairing", "font tieng viet": "fonts vietnamese", "co chu": "typography scale size",
    "khoang cach": "spacing", "du lieu mau": "data sample dummy", "du lieu gia": "data sample dummy",
    "chua co du lieu": "empty states", "dang tai": "loading skeleton", "thong bao loi": "error forms validation",
    "loi bieu mau": "error forms validation", "luong dang ky": "signup onboarding flows",
    "nen toi": "dark theme", "man hinh nho": "responsive mobile", "dien thoai": "mobile phone",
    "chuyen dong": "animation motion", "bieu tuong": "icon icons", "hinh minh hoa": "illustration illustrations",
    "hinh nen": "background patterns", "khung thiet bi": "mockup device", "dau trang": "hero",
    "bang gia": "pricing", "cau hoi thuong gap": "faq", "bo cuc": "layout",
}


def normalize(value):
    value = unicodedata.normalize("NFKD", str(value).casefold().replace("đ", "d"))
    return "".join(character for character in value if not unicodedata.combining(character))


def tokens(value):
    return set(re.findall(r"[a-z0-9]+", normalize(value))) - STOP_WORDS


def task_terms(query):
    original = tokens(query)
    expanded = set(original)
    normalized = " " + " ".join(re.findall(r"[a-z0-9]+", normalize(query))) + " "
    for phrase, keywords in TASK_PHRASES.items():
        if " " + phrase + " " in normalized:
            expanded.update(tokens(keywords))
    return original, expanded


def validate_catalog(catalog):
    categories = catalog.get("categories")
    if not isinstance(categories, list) or not categories:
        raise ValueError("Catalog must have a nonempty categories array.")
    identifiers = set()
    resource_ids = set()
    for category in categories:
        identifier = str(category.get("id", ""))
        if not identifier or identifier in identifiers:
            raise ValueError("Each category needs a unique id.")
        identifiers.add(identifier)
        if not isinstance(category.get("resources"), list) or not category["resources"]:
            raise ValueError("Category %s has no resources." % identifier)
        for resource in category["resources"]:
            resource_id = str(resource.get("id", ""))
            parsed = urlparse(str(resource.get("url", "")))
            if not resource_id or resource_id in resource_ids:
                raise ValueError("Each resource needs a unique id.")
            if parsed.scheme not in ("https", "http") or not parsed.netloc:
                raise ValueError("Resource %s needs an HTTP(S) URL." % resource_id)
            resource_ids.add(resource_id)
    return catalog


def load_json(path):
    return validate_catalog(json.loads(Path(path).expanduser().read_text(encoding="utf-8-sig")))


def parse_library(path, bundled):
    """Read numbered Markdown groups without copying post text or image references."""
    text = Path(path).expanduser().read_text(encoding="utf-8-sig")
    known_categories = {str(category["id"]): category for category in bundled["categories"]}
    known_resources = {
        resource["url"]: resource
        for category in bundled["categories"]
        for resource in category["resources"]
    }
    headings = list(re.finditer(r"^###\s+(\d{1,3})\.\s+(.+?)\s*$", text, re.MULTILINE))
    categories = []
    for offset, heading in enumerate(headings):
        index = int(heading.group(1))
        identifier = "%02d" % index
        source_heading = heading.group(2).strip()
        known_category = known_categories.get(identifier, {})
        matching_heading = normalize(source_heading) in {
            normalize(known_category.get("name_en", "")), normalize(known_category.get("name_vi", ""))
        }
        category = copy.deepcopy(known_category) if matching_heading else {}
        category.update({"id": identifier, "index": index, "name_vi": source_heading, "resources": []})
        category.setdefault("name_en", source_heading)
        category.setdefault("purpose", "Resources from the selected reference library.")
        category.setdefault("keywords", [])
        section = text[heading.end():headings[offset + 1].start() if offset + 1 < len(headings) else len(text)]
        links = re.findall(r"^\s*-\s+\[[^\]]+\]\((https?://[^\s)]+)\)", section, re.MULTILINE)
        for position, url in enumerate(links, 1):
            parsed = urlparse(url)
            # Resource bullets only. Local image links never enter the catalog.
            if parsed.path.lower().endswith((".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg")):
                continue
            resource = copy.deepcopy(known_resources.get(url, {}))
            resource.update({"id": "%s-%02d" % (identifier, position), "url": url})
            resource.setdefault("name", parsed.netloc.removeprefix("www."))
            resource.setdefault("description", "Resource supplied in the selected reference library; inspect its current offering.")
            resource.setdefault("tags", [])
            category["resources"].append(resource)
        if category["resources"]:
            categories.append(category)
    if not categories:
        raise ValueError("No numbered Markdown resource groups were found; expected ### 01. Heading and HTTP(S) resource bullets.")
    captured = re.search(r"Thu thập ngày\s+\*\*(\d{4}-\d{2}-\d{2})\*\*", text)
    author_line = re.search(r"^Nguồn:\s*(.+)$", text, re.MULTILINE)
    provenance = {
        "source": "Selected Markdown reference library",
        "capture_date": captured.group(1) if captured else None,
        "verification": "Library URLs parsed locally; service terms and availability not verified.",
    }
    if author_line:
        provenance["attribution_links"] = re.findall(r"\[([^\]]+)\]\((https?://[^\s)]+)\)", author_line.group(1))
    return validate_catalog({"schema_version": 1, "provenance": provenance, "categories": categories})


def resolve_catalog(args):
    if args.catalog:
        catalog = load_json(args.catalog)
        return catalog, {"kind": "custom_catalog", "path": str(Path(args.catalog).expanduser()), "fallback": False, "warnings": []}
    bundled = load_json(DEFAULT_CATALOG)
    requested = args.library or os.environ.get("WEB_REFERENCE_LIBRARY")
    if requested:
        try:
            catalog = parse_library(requested, bundled)
            return catalog, {"kind": "markdown_library", "path": str(Path(requested).expanduser()), "via": "argument" if args.library else "WEB_REFERENCE_LIBRARY", "fallback": False, "warnings": []}
        except (OSError, ValueError, UnicodeError) as error:
            return bundled, {"kind": "bundled_catalog", "path": str(DEFAULT_CATALOG), "fallback": True, "requested_library": str(requested), "warnings": ["Could not read the selected library: %s. Using the bundled snapshot explicitly as fallback." % error]}
    return bundled, {"kind": "bundled_catalog", "path": str(DEFAULT_CATALOG), "fallback": False, "warnings": []}


def select_categories(categories, requested):
    if not requested:
        return categories
    value = normalize(requested).strip()
    if value.isdigit():
        value = "%02d" % int(value)
        matches = [category for category in categories if str(category["id"]) == value]
    else:
        matches = [category for category in categories if value in normalize("%s %s" % (category.get("name_en", ""), category.get("name_vi", "")))]
    if not matches:
        raise ValueError("Unknown category '%s'. Use its number (01-25) or part of its English/Vietnamese title." % requested)
    return matches


def find_candidates(categories, query, limit):
    original_terms, query_terms = task_terms(query)
    normalized_query = normalize(query)
    candidates = []
    for category in categories:
        category_text = " ".join([category.get("name_en", ""), category.get("name_vi", ""), category.get("purpose", ""), " ".join(category.get("keywords", []))])
        group_terms = query_terms & tokens(category_text)
        for resource in category["resources"]:
            resource_text = " ".join([resource.get("name", ""), resource.get("description", ""), " ".join(resource.get("tags", []))])
            direct_terms = query_terms & tokens(resource_text)
            name = normalize(resource.get("name", "")).strip()
            name_match = bool(name and name in normalized_query)
            if not group_terms and not direct_terms and not name_match:
                continue
            # Lexical routing only: these weights never measure service quality.
            relevance = len(direct_terms) * 3 + len(group_terms) + (6 if name_match else 0)
            candidates.append((relevance, int(category.get("index", 0)), resource["id"], {
                "id": resource["id"], "name": resource.get("name", ""), "url": resource["url"],
                "description": resource.get("description", ""),
                "category": {"id": category["id"], "name_en": category.get("name_en", ""), "name_vi": category.get("name_vi", "")},
                "match": {"query_terms": sorted(direct_terms | group_terms), "resource_terms": sorted(direct_terms), "category_terms": sorted(group_terms), "name_match": name_match},
            }))
    candidates.sort(key=lambda item: (-item[0], item[1], item[2]))
    return [item[3] for item in candidates[:limit]], len(candidates), sorted(original_terms), sorted(query_terms - original_terms)


def main(argv=None):
    # Preserve Vietnamese output on Windows even outside the host's UTF-8 launcher.
    for stream in (sys.stdout, sys.stderr):
        if hasattr(stream, "reconfigure"):
            stream.reconfigure(encoding="utf-8")
    parser = argparse.ArgumentParser(description=__doc__, epilog="Supported library syntax: numbered headings such as '### 01. Heading', followed by one-line '- [label](https://example.com/)' resource bullets. This parses the collection format, not arbitrary Markdown. Examples: --query 'SaaS pricing and FAQ' | --query 'empty loading error' --category 24 --json. Ordering is lexical task relevance, never a quality ranking.")
    parser.add_argument("--query", required=True, help="Concrete task, resource name, or keywords; English and Vietnamese supported.")
    parser.add_argument("--category", help="Optional category number or English/Vietnamese title fragment.")
    source = parser.add_mutually_exclusive_group()
    source.add_argument("--catalog", type=Path, help="Use a task-specific catalog.json instead of the bundled catalog.")
    source.add_argument("--library", type=Path, help="Use the supported numbered Markdown collection format. Otherwise WEB_REFERENCE_LIBRARY is consulted. A missing/invalid library reports an explicit bundled fallback.")
    parser.add_argument("--limit", type=int, default=12, help="Maximum returned candidates (default: 12).")
    parser.add_argument("--json", action="store_true", help="Print machine-readable output.")
    args = parser.parse_args(argv)
    try:
        if not args.query.strip():
            raise ValueError("Query cannot be empty.")
        if args.limit < 1:
            raise ValueError("Limit must be at least 1.")
        catalog, resolution = resolve_catalog(args)
        categories = select_categories(catalog["categories"], args.category)
        candidates, total, query_terms, expanded_terms = find_candidates(categories, args.query, args.limit)
        result = {
            "status": "matches" if candidates else "no_match", "query": args.query, "query_terms": query_terms, "expanded_terms": expanded_terms,
            "category_filter": args.category, "source": resolution, "candidate_count": total, "returned_count": len(candidates),
            "ordering": "Deterministic lexical task relevance, then original category/resource order; not a quality ranking.",
            "verification": "Inspect shortlisted sources and verify current license, price, compatibility, and availability before use.",
            "candidates": candidates,
        }
        if not candidates:
            result["message"] = "No matching candidates. Try a concrete feature or category number; inspect the full resource catalog if needed."
        if args.json:
            print(json.dumps(result, ensure_ascii=False, indent=2))
        else:
            print("Source: %s%s" % (resolution["kind"], " (FALLBACK)" if resolution["fallback"] else ""))
            for warning in resolution["warnings"]:
                print("Warning: %s" % warning)
            if candidates:
                print("Candidates: %s of %s lexical matches; no service quality ranking." % (len(candidates), total))
                for candidate in candidates:
                    print("\n[%s] %s — %s" % (candidate["category"]["id"], candidate["category"]["name_en"], candidate["name"]))
                    print(candidate["url"])
                    print(candidate["description"])
                    print("Matched: %s" % ", ".join(candidate["match"]["query_terms"]))
            else:
                print(result["message"])
            print("\n%s" % result["verification"])
        return 0
    except (OSError, ValueError, KeyError, TypeError, UnicodeError) as error:
        if args.json:
            print(json.dumps({"status": "error", "message": str(error)}, ensure_ascii=False, indent=2))
        else:
            print("Error: %s" % error, file=sys.stderr)
        return 2


if __name__ == "__main__":
    sys.exit(main())
