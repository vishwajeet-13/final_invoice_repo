from django.db import models
from .party_models import Party
from .user_models import User
from .item_models import Item

class Invoice(models.Model):
    inv_num = models.CharField(max_length=15, unique=True)
    inv_date = models.DateField()
    party = models.ForeignKey(Party, on_delete=models.CASCADE)
    items = models.ManyToManyField(Item, through='InvoiceItem', related_name='invoices')
    customer = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name='invoice')
    is_paid = models.BooleanField()
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    remark = models.TextField()

def __str__(self):
    return f"Invoice {self.inv_num}"