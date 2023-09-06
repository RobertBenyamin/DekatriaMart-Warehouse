from django.shortcuts import render

def home(request):
    context = {
        'Name': 'Mie Indonesia',
        'Amount': '100',
        'Description': "Mie rasa soto",
        'Price': "3000",
    }

    return render(request, "main.html", context)
