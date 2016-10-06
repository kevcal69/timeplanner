from django.conf.urls import url as u
from timegroup import views

urlpatterns = [
    u(r'^upload_csv$', views.IndexAdminView.as_view(), name='upload'),
    u(r'^$',
        views.CreateGroupView.as_view(), name='create-group'),
    u(r'^group$', views.GroupView.as_view(), name='group')
]
