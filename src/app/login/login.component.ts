@@ .. @@
           // Redirecionar baseado no tipo de usuário
           if (this.authService.isAdmin()) {
             this.router.navigate(['/admin/dashboard']);
           } else {
-            this.router.navigate(['/menu']);
+            this.router.navigate(['/tecnico/dashboard']);
           }
         },