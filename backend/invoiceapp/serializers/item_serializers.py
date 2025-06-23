from rest_framework import serializers
from ..models.item_models import Item

class ItemSerializer(serializers.ModelSerializer):

   class Meta:
    model = Item
    fields = '__all__'