from rest_framework import permissions


class IsPostOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):           
        if request.method in permissions.SAFE_METHODS:
            return True 
        else:
            return obj.auther == request.user and request.user != 'AnonymousUser'



        