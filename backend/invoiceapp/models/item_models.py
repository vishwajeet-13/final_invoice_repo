from django.db import models

class Item(models.Model):
    item_name = models.CharField(max_length=100)
    rate = models.PositiveIntegerField()
    gst_choices = [
        ('0','NIL'),
        ('5', 'GST 5%'),
        ('12', 'GST 12%'),
        ('18', 'GST 18%'),
        ('28', 'GST 28%'),
    ]
    gst = models.CharField(max_length=2,choices=gst_choices, default='0')

def __str__(self):
    return self.item_name