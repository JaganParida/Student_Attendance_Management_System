import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon'; // <-- ADD THIS IMPORT

@Component({
  selector: 'app-about-page',
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule,
    MatIconModule // <-- ADD THIS MODULE
  ],
  templateUrl: './about-page.html',
  styleUrl: './about-page.css'
})
export class AboutPageComponent {
  
  // No logic is needed here. The content is static in the HTML.

}