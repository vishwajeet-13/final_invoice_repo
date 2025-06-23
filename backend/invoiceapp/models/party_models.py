from django.db import models

class Party(models.Model):
    c_name = models.CharField(max_length=100)
    contact = models.CharField(max_length=15)
    address = models.TextField()
    gst = models.CharField(max_length=15)

def __str__(self):
    return self.c_name