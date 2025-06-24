from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView,TokenRefreshView,TokenVerifyView
from .views import home

from django.urls import re_path

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('invoiceapp.urls')),
    #  path('',home),


    #simple-jwt
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
      re_path(r'^(?!api/).*$', home),
]
