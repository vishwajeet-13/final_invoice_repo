from rest_framework import serializers
from ..serializers.party_serializers import PartySerializer
from ..models.invoice_models import Invoice

class InvoiceItemReadSerializer(serializers.Serializer):
    item_name = serializers.CharField(source='item.item_name')
    rate = serializers.IntegerField(source='rate_at_purchase')
    gst = serializers.CharField(source='gst_at_purchase')
    quantity = serializers.IntegerField()
    
class InvoiceReadSerializer(serializers.ModelSerializer):
    party = PartySerializer()
    items = InvoiceItemReadSerializer(many=True, read_only=True)
    total_amount = serializers.SerializerMethodField()

    class Meta:
        model = Invoice
        fields = ['inv_num', 'inv_date', 'party', 'items', 'remark', 'total_amount']

    def get_total_amount(self, obj):
        return sum([item.total for item in obj.items.all()])

