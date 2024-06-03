import { TestBed } from '@angular/core/testing';

import { SnackBarMessagesService } from './snack-bar-messages.service';

describe('SnackBarMessagesService', () => {
  let service: SnackBarMessagesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SnackBarMessagesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
