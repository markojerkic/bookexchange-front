import {Injectable} from '@angular/core';
import {MessageService} from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private messageService: MessageService) { }

  public warn(message: string): void {
    this.messageService.add({severity:'warn', summary: 'Upozorenje', detail: message});
  }

  public error(message: string): void {
    this.messageService.add({severity:'error', summary: 'Pogreška', detail: message});
  }

  public success(message: string): void {
    this.messageService.add({severity:'success', summary: 'Uspijeh', detail: message});
  }
}
