"""Portable behavior checks for resource lookup; run with Python 3.9+.

python -m unittest discover -s tests -v
"""

import importlib.util
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import unittest


ROOT = Path(__file__).resolve().parents[1]
SKILL = ROOT / "web-reference-design"
HELPER = SKILL / "scripts" / "find_references.py"
SPEC = importlib.util.spec_from_file_location("reference_lookup", HELPER)
LOOKUP = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(LOOKUP)


class LookupBehavior(unittest.TestCase):
    def run_lookup(self, *arguments, helper=HELPER, environment=None):
        clean_environment = dict(os.environ)
        clean_environment.pop("WEB_REFERENCE_LIBRARY", None)
        clean_environment.update(environment or {})
        process = subprocess.run(
            [sys.executable, str(helper), *arguments, "--json"],
            capture_output=True, text=True, encoding="utf-8", env=clean_environment,
        )
        return process.returncode, json.loads(process.stdout)

    def test_state_repair_can_stay_in_its_category(self):
        code, result = self.run_lookup("--query", "empty error recovery", "--category", "24")
        self.assertEqual(code, 0)
        self.assertEqual(result["status"], "matches")
        self.assertTrue(all(candidate["category"]["id"] == "24" for candidate in result["candidates"]))
        names = {candidate["name"] for candidate in result["candidates"]}
        self.assertIn("PatternFly Empty State", names)
        self.assertIn("GOV.UK Error Summary", names)

    def test_vietnamese_task_survives_diacritic_normalization(self):
        _, result = self.run_lookup("--query", "nén ảnh", "--category", "22")
        self.assertEqual(result["candidates"][0]["name"], "Squoosh")
        self.assertTrue(result["expanded_terms"])

    def test_unrelated_and_narrative_queries_have_no_candidates(self):
        for query in ("migrate postgres database schema", "existing work needs preserve only"):
            with self.subTest(query=query):
                code, result = self.run_lookup("--query", query)
                self.assertEqual(code, 0)
                self.assertEqual(result["status"], "no_match")
                self.assertEqual(result["candidates"], [])

    def test_bad_category_is_an_error_instead_of_silently_widening(self):
        code, result = self.run_lookup("--query", "motion", "--category", "99")
        self.assertEqual(code, 2)
        self.assertEqual(result["status"], "error")

    def test_missing_library_fallback_is_visible(self):
        with tempfile.TemporaryDirectory(prefix="reference-lookup-") as temporary:
            missing = Path(temporary) / "missing.md"
            code, result = self.run_lookup("--query", "typography", "--library", str(missing))
            self.assertEqual(code, 0)
            self.assertTrue(result["source"]["fallback"])
            self.assertEqual(result["source"]["requested_library"], str(missing))
            self.assertTrue(result["source"]["warnings"])

    def test_arbitrary_numbered_group_does_not_inherit_old_category(self):
        with tempfile.TemporaryDirectory(prefix="reference-lookup-") as temporary:
            library = Path(temporary) / "library.md"
            library.write_text("### 01. Legal services\n\n- [Legal aid](https://example.com/legal)\n", encoding="utf-8")
            _, result = self.run_lookup("--query", "animated components", "--library", str(library))
            self.assertEqual(result["source"]["kind"], "markdown_library")
            self.assertFalse(result["source"]["fallback"])
            self.assertEqual(result["status"], "no_match")
            _, relevant = self.run_lookup("--query", "legal", "--library", str(library))
            self.assertEqual(relevant["candidates"][0]["url"], "https://example.com/legal")

    def test_selected_library_ignores_image_bullets_and_reports_env_source(self):
        with tempfile.TemporaryDirectory(prefix="reference-lookup-") as temporary:
            library = Path(temporary) / "library.md"
            library.write_text("### 31. Transit maps\n\n- [Image](https://example.com/map.jpg)\n- [Transit](https://example.com/transit)\n", encoding="utf-8")
            _, result = self.run_lookup("--query", "transit", environment={"WEB_REFERENCE_LIBRARY": str(library)})
            self.assertEqual(result["source"]["via"], "WEB_REFERENCE_LIBRARY")
            self.assertEqual([candidate["url"] for candidate in result["candidates"]], ["https://example.com/transit"])

    def test_catalog_rejects_executable_url(self):
        catalog = {"categories": [{"id": "1", "resources": [{"id": "1-1", "url": "javascript:alert(1)"}]}]}
        with self.assertRaises(ValueError):
            LOOKUP.validate_catalog(catalog)

    def test_move_to_another_directory_keeps_lookup_usable(self):
        with tempfile.TemporaryDirectory(prefix="reference-portable-") as temporary:
            moved_skill = Path(temporary) / "web-reference-design"
            shutil.copytree(SKILL, moved_skill, ignore=shutil.ignore_patterns("__pycache__", "*.pyc"))
            code, result = self.run_lookup("--query", "fluid typography", helper=moved_skill / "scripts" / "find_references.py")
            self.assertEqual(code, 0)
            self.assertEqual(result["source"]["kind"], "bundled_catalog")
            self.assertEqual(result["candidates"][0]["name"], "Utopia")
            self.assertEqual(Path(result["source"]["path"]), moved_skill / "references" / "catalog.json")


if __name__ == "__main__":
    unittest.main()
