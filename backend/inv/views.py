from django.shortcuts import render

def home(request):
    return render(request, 'index.html')
    # print(base_dir)
    pass