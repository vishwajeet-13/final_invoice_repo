from rest_framework import serializers
from ..models.party_models import Party

class PartySerializer(serializers.ModelSerializer):

   class Meta:
    model = Party
    fields = '__all__'