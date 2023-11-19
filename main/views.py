import json
from django.shortcuts import render, redirect
from django.http import HttpResponseRedirect, HttpResponse, JsonResponse, HttpResponseNotFound
from main.forms import ItemForm, UserRegisterForm
from django.urls import reverse
from main.models import Item
from django.core import serializers
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
import datetime

@login_required(login_url='/login')
def home(request):
    items = Item.objects.filter(user=request.user)

    context = {
        'user': request.user,
        'items': items,
        'last_login': request.COOKIES['last_login'][:-7],
    }

    return render(request, "main.html", context)

@csrf_exempt
def register(request):
    form = UserRegisterForm()

    if request.method == "POST":
        form = UserRegisterForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, 'Your account has been successfully created!')
            return redirect('main:login')
    context = {'form':form}
    return render(request, 'register.html', context)

@csrf_exempt
def login_user(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            response = HttpResponseRedirect(reverse("main:home")) 
            response.set_cookie('last_login', str(datetime.datetime.now()))
            return response
        else:
            messages.info(request, 'Sorry, incorrect username or password. Please try again.')
    context = {}
    return render(request, 'login.html', context)

@csrf_exempt
def logout_user(request):
    logout(request)
    response = HttpResponseRedirect(reverse('main:login'))
    response.delete_cookie('last_login')
    return response

@login_required(login_url='/login')
def create_item(request):
    form = ItemForm(request.POST or None)

    if form.is_valid() and request.method == "POST":
        item = form.save(commit=False)
        item.user = request.user
        item.save()
        item = form.save(commit=False)
        item.user = request.user
        item.save()
        return HttpResponseRedirect(reverse('main:home'))

    context = {'form': form}
    return render(request, "create_item.html", context)

@csrf_exempt
def create_item_ajax(request):
    if request.method == 'POST':
        name = request.POST.get("name")
        amount = request.POST.get("amount")
        description = request.POST.get("description")
        price = request.POST.get("price")
        user = request.user

        new_product = Item(name=name, amount=amount, description=description, price=price, user=user)
        new_product.save()

        return HttpResponse(b"CREATED", status=201)

    return HttpResponseNotFound()

@csrf_exempt
def edit_item_ajax(request, item_id):
    if request.method == 'POST':
        name = request.POST.get("nameEdit")
        amount = request.POST.get("amountEdit")
        description = request.POST.get("descriptionEdit")
        price = request.POST.get("priceEdit")
        user = request.user

        # Item yang akan diubah
        item = Item.objects.get(pk=item_id)
        
        item.name = name
        item.amount = amount
        item.description = description
        item.price = price
        item.save()

        return JsonResponse({"success": True})

    return JsonResponse({"success": False}, status=400)

@login_required(login_url='/login')
def edit_item(request, item_id):
    item = Item.objects.get(pk=item_id)

    form = ItemForm(request.POST or None, instance=item)

    if form.is_valid() and request.method == "POST":
        form.save()
        return HttpResponseRedirect(reverse('main:home'))

    context = {'form': form}
    return render(request, "edit_item.html", context)

def delete_item(request, item_id):
    item = Item.objects.get(pk=item_id)

    if request.method == 'DELETE':
        item.delete()
        return JsonResponse({'success': True,})

def increase_amount(request, item_id):
    item = Item.objects.get(pk=item_id)
    item.amount += 1
    item.save()
    return JsonResponse({'success': True, 'new_amount': item.amount})

def decrease_amount(request, item_id):
    item = Item.objects.get(pk=item_id)
    if item.amount > 0:
        item.amount -= 1
        item.save()
    return JsonResponse({'success': True, 'new_amount': item.amount})

@csrf_exempt
def create_item_flutter(request):
    if request.method == 'POST':
        
        data = json.loads(request.body)

        new_item = Item.objects.create(
            user = request.user,
            name = data["name"],
            amount = int(data["amount"]),
            description = data["description"],
            price = int(data["price"]),
        )

        new_item.save()

        return JsonResponse({"status": "success"}, status=200)
    else:
        return JsonResponse({"status": "error"}, status=401)

def get_item_json(request):
    items = Item.objects.filter(user=request.user)
    return HttpResponse(serializers.serialize('json', items))

def show_xml(request):
    data = Item.objects.all()
    return HttpResponse(serializers.serialize("xml", data), content_type="application/xml")

def show_xml_by_id(request, id):
    data = Item.objects.filter(pk=id)
    return HttpResponse(serializers.serialize("xml", data), content_type="application/xml")

def show_json(request):
    data = Item.objects.all()
    return HttpResponse(serializers.serialize("json", data), content_type="application/json")

def show_json_by_id(request, id):
    data = Item.objects.filter(pk=id)
    return HttpResponse(serializers.serialize("json", data), content_type="application/json")
    