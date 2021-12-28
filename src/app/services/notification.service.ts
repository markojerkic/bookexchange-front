import {Injectable} from '@angular/core';
import {MessageService} from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private messageService: MessageService) {
  }

  public warn(message: string, summary: string = 'Upozorenje'): void {
    this.messageService.add({severity: 'warn', summary: summary, detail: message});
  }

  public error(message: string, summary: string = 'Pogreška'): void {
    this.messageService.add({severity: 'error', summary: summary, detail: message});
  }

  public success(message: string, summary: string = 'Uspijeh'): void {
    this.messageService.add({severity: 'success', summary: summary, detail: message});
  }
}
