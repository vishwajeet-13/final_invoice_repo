
from rest_framework import serializers
from ..models.party_models import Party
from ..models.item_models import Item
from ..models.user_models import User
from ..models.invoice_models import Invoice
from ..models.invoice_item_models import InvoiceItem
from ..serializers.invoiceitems_serializers import InvoiceItemSerializer
from ..serializers.party_serializers import PartySerializer



class InvoicesSerializer(serializers.ModelSerializer):
    invoice_items = InvoiceItemSerializer(many=True)
    party = PartySerializer(read_only=True)
    customer = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    class Meta:
        model = Invoice
        fields = ['customer','inv_num', 'inv_date', 'party', 'invoice_items', 'remark', 'is_paid']
    
    def create(self, validated_data):
        items_data = validated_data.pop('items', [])
        invoice = Invoice.objects.create(**validated_data)
        for item_data in items_data:
            Item.objects.create(invoice=invoice, **item_data)
        return invoice


class InvoiceSerializer(serializers.ModelSerializer):
    party = PartySerializer()
    invoice_items = InvoiceItemSerializer(many=True)
    total = serializers.DecimalField(max_digits=10, decimal_places=2)
    class Meta:
        model = Invoice
        fields = ['customer','inv_num', 'inv_date', 'party', 'invoice_items', 'remark','is_paid','total']

    def create(self, validated_data):
        party_data = validated_data.pop('party')
        items_data = validated_data.pop('invoice_items')
        customer = validated_data['customer']
        total = validated_data.get('total')
        party, _ = Party.objects.get_or_create(
            c_name=party_data['c_name'],
            defaults=party_data
        )
        invoice = Invoice.objects.create(
            inv_num=validated_data['inv_num'],
            inv_date=validated_data['inv_date'],
            party=party,
            customer=customer,
            remark=validated_data.get('remark', ''),
            is_paid=validated_data.get('is_paid'),
            total=total 
        )
        for item_entry in items_data:
            item, _ = Item.objects.get_or_create(
                item_name=item_entry['item_name'],
                defaults={
                    'rate': item_entry['rate'],
                    'gst': item_entry['gst']
                }
            )
            quantity = item_entry['quantity']
            rate = item_entry['rate']
            gst = item_entry['gst']
            InvoiceItem.objects.create(
                invoice=invoice,
                item=item,
                quantity=quantity,
                rate=rate,
                gst=gst,
            )

        return invoice
