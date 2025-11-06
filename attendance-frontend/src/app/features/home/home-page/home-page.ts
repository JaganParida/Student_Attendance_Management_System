import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button'; // <-- ADD THIS
import { RouterLink } from '@angular/router'; // <-- ADD THIS
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule, 
    MatButtonModule, // <-- ADD THIS
    RouterLink,
    MatIconModule    // <-- ADD THIS
  ],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css'
})
export class HomePageComponent {
  // Logic is not needed here, the page is static
}