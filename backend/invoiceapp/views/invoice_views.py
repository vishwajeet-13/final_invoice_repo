
from rest_framework import generics, permissions
from ..models.invoice_models import Invoice
from ..serializers.invoice_serializers import InvoiceSerializer, InvoicesSerializer 
from ..serializers.invoice_item_read_serializers import InvoiceReadSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..models.party_models import Party
from ..serializers.party_serializers import PartySerializer
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import NotFound



class InvoiceListView(APIView):
    def get(self, request, uid=None):
        if uid is None or uid <= 0:

            return Response({'error': 'User ID (uid) is required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        invoices = Invoice.objects.filter(customer=uid)
        if not invoices.exists():

            return Response({'error': 'No invoices found for this user.'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = InvoicesSerializer(invoices, many=True)

        return Response(serializer.data, status=200)


class InvoiceCreateView(generics.CreateAPIView):

    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer
    permission_classes = []

    def create(self, request, *args, **kwargs):
        print("Request Data:", request.data)  
        return super().create(request, *args, **kwargs)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class InvoiceDetailView(generics.RetrieveAPIView):
    serializer_class = InvoiceReadSerializer
    # permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'inv_num' 

    def get_queryset(self):
        return Invoice.objects.filter(user=self.request.user)
    

class PartyCreateView(generics.CreateAPIView):
    queryset = Party.objects.all()
    serializer_class = PartySerializer
    
class PartyListView(APIView):

    def get(self, request):
        search = request.GET.get("search", "")
        qs = Party.objects.all()

        if search:
            qs = qs.filter(c_name__icontains=search)
        serializer = PartySerializer(qs, many=True)

        return Response(serializer.data)
    
class PartyByNameView(APIView):

    def get(self, request, name):
        party = get_object_or_404(Party, c_name=name)
        serializer = PartySerializer(party)

        return Response(serializer.data)
    

class LatestInvoiceView(generics.RetrieveAPIView):
    serializer_class = InvoiceSerializer
    
    def get_object(self):
        try:
            latest_invoice = Invoice.objects.filter(
            ).order_by('-id').first()
            
            if not latest_invoice:
                raise NotFound("No invoices found")
                
            return latest_invoice
            
        except Exception as e:
            raise NotFound(f"Error retrieving invoice: {str(e)}")