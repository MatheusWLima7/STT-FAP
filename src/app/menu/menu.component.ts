@@ .. @@
 import { Component } from '@angular/core';
+import { CommonModule } from '@angular/common';
+import { RouterModule, Router } from '@angular/router';
+import { AuthService } from '../services/auth.service';
 
 @Component({
   selector: 'app-menu',
-  imports: [],
+  standalone: true,
+  imports: [CommonModule, RouterModule],
   templateUrl: './menu.component.html',
   styleUrl: './menu.component.css'
 })
 export class MenuComponent {
+  constructor(
+    private authService: AuthService,
+    private router: Router
+  ) {}
 
-}
+  isAdmin(): boolean {
+    return this.authService.isAdmin();
+  }
+
+  isTecnico(): boolean {
+    return this.authService.isTecnico();
+  }
+
+  logout() {
+    this.authService.logout();
+    this.router.navigate(['/login']);
+  }
+}