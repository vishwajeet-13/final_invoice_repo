from rest_framework import serializers

class InvoiceItemSerializer(serializers.Serializer):
    item_name = serializers.CharField(max_length=100)
    rate = serializers.IntegerField()
    gst = serializers.CharField(max_length=3)
    quantity = serializers.IntegerField()
    
    def to_representation(self, instance):
        if isinstance(instance, dict):
            return instance
        return {
            'item_name': instance.item.item_name,
            'rate': instance.rate,
            'gst': instance.gst,
            'quantity': instance.quantity,
        }