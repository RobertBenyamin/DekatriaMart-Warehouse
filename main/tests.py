from django.test import TestCase
from main.models import Item

class ItemTestCase(TestCase):
    def setUp(self):
        Item.objects.create(name = "susu", amount = 10, description = "Susu rasa vanilla", price = 7000 )
        Item.objects.create(name = "mie", amount = 50, description = "Mie rasa soto", price = 3000)

    def test_items_name_matches_description(self):
        """Test if the item name is match with its description"""
        susu = Item.objects.get(name = "susu")
        mie = Item.objects.get(name = "mie")
        self.assertEqual(susu.description, 'Susu rasa vanilla')
        self.assertEqual(mie.description, 'Mie rasa soto')
