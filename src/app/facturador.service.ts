import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class FacturadorService {
  
  formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses comienzan en 0
    const year = date.getFullYear();
  
    return `${day}/${month}/${year}`;
  }
  constructor() { 
    
  }
  
}
