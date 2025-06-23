from django.contrib import admin
from .models.invoice_item_models import InvoiceItem
from .models.invoice_models import Invoice
from .models.item_models import Item
from .models.party_models import Party
from .models.user_models import User

admin.site.register(InvoiceItem)
admin.site.register(Invoice)
admin.site.register(Item)
admin.site.register(Party)
admin.site.register(User)
