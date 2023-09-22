from django.urls import path
from . import views
from main.views import home, create_item, show_xml, show_json, show_xml_by_id, show_json_by_id 
from main.views import register, login_user, logout_user

app_name = 'main'

urlpatterns = [
    path('', views.home, name='home'),

    path('create-item', create_item, name='create_item'),

    path('register/', register, name='register'),
    path('login/', login_user, name='login'),
    path('logout/', logout_user, name='logout'),

    path('xml/', show_xml, name='show_xml'), 
    path('xml/<int:id>/', show_xml_by_id, name='show_xml_by_id'),
    path('json/', show_json, name='show_json'), 
    path('json/<int:id>/', show_json_by_id, name='show_json_by_id'), 
]