#!/usr/bin/env python3
"""
Tests unitaires pour le module main.py.
"""

import sys
import os

# Ajouter le dossier src au chemin de recherche des modules
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "src")))

from main import main


def test_main_output(capsys):
    """Test que la fonction main affiche le message attendu."""
    main()
    captured = capsys.readouterr()
    assert "Bienvenue dans le projet EPS !" in captured.out
    assert "Ce projet est en cours de développement." in captured.out
