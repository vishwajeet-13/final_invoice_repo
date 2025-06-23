from django.db import models
from .invoice_models import Invoice
from .item_models import Item


class InvoiceItem(models.Model):
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name='invoice_items')
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    rate = models.PositiveIntegerField()
    gst = models.CharField(max_length=3)
    quantity = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.quantity} x {self.item.item_name} in {self.invoice.inv_num}"