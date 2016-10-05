from django.conf.urls import url as u
from timegroup import views

urlpatterns = [
    u(r'^$', views.IndexAdminView.as_view(), name='index-admin'),
    u(r'^create-group$',
        views.CreateGroupView.as_view(), name='create-group'),
    u(r'^add-worker$', views.AddClientWorkers.as_view(), name='add-worker')
]
