from django.urls import path
from . import views
from main.views import home, show_xml, show_json, show_xml_by_id, show_json_by_id 
from main.views import register, login_user, logout_user, increase_amount, decrease_amount
from main.views import create_item, edit_item, delete_item, get_item_json, create_item_ajax, create_item_flutter
from django.conf import settings
from django.conf.urls.static import static

app_name = 'main'

urlpatterns = [
    path('', home, name='home'),

    path('create-item/', create_item, name='create_item'),
    path('create-ajax/', create_item_ajax, name='create_ajax'),
    path('edit-item/<int:item_id>/', edit_item, name='edit_item'),
    path('edit-item-ajax/<int:item_id>/', edit_item, name='edit_item_ajax'),
    path('delete-item/<int:item_id>/', delete_item, name='delete_item'),
    path('get-item/', get_item_json, name='get_item_json'),

    path('register/', register, name='register'),
    path('login/', login_user, name='login'),
    path('logout/', logout_user, name='logout'),

    path('increase-amount/<int:item_id>/', increase_amount, name='increase_amount'),
    path('decrease-amount/<int:item_id>/', decrease_amount, name='decrease_amount'),

    path('create-flutter/', create_item_flutter, name='create_item_flutter'),

    path('xml/', show_xml, name='show_xml'), 
    path('xml/<int:id>/', show_xml_by_id, name='show_xml_by_id'),
    path('json/', show_json, name='show_json'), 
    path('json/<int:id>/', show_json_by_id, name='show_json_by_id'), 
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)