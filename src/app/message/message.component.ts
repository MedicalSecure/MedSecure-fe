
import { Component } from '@angular/core';
import { ChatModule, ConversationalUIModule, Message, SendMessageEvent, User } from '@progress/kendo-angular-conversational-ui';

import { CommonModule } from '@angular/common';


@Component({
  providers: [  ],
  selector: 'app-messages',
 template: `<kendo-chat
 [user]="user"
 [messages]="messages"
 (sendMessage)="sendMessage($event)"
 [style.height.px]="250"

>
</kendo-chat>
`,
  standalone:true,
  imports:[ CommonModule , ChatModule ,ConversationalUIModule] 
})
export class MessageComponent {
  public user: User = { id: 1 };

public messages: Message[] = [
    {
        author: this.user,
        text: 'nothing unusual'
    },
    {
      author: this.user,
      text: 'nothing unusual',
    }
];
public sendMessage(e: SendMessageEvent): void {
  this.messages = [...this.messages, e.message];
}
}
