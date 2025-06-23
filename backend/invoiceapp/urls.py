from django.urls import path
from .views.invoice_views import InvoiceCreateView, InvoiceListView, InvoiceDetailView, PartyCreateView, PartyListView, PartyByNameView, LatestInvoiceView
from .views.user_views import UserView, LoginView



urlpatterns = [
    path('user/', UserView.as_view(), name='create-user'),
    path('user/login', LoginView.as_view(), name='login-user'),
    path('invoices/create/', InvoiceCreateView.as_view(), name='invoice-create'),
    path('invoices/<int:uid>', InvoiceListView.as_view(), name='invoice-list'),
    path('invoices/latest/', LatestInvoiceView.as_view(), name='invoice-latest'),
    path('invoices/<str:inv_num>/', InvoiceDetailView.as_view(), name='invoice-detail'),
    path('parties/', PartyListView.as_view(), name='parties'),
    path('parties/by-name/<str:name>/', PartyByNameView.as_view(), name='party-by-name'),
    path('party/create/', PartyCreateView.as_view(), name='party-create'),

]
