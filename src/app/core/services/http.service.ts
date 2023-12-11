import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

export interface RegistrationParams {
  email: string;
  name: string;
  password: string;
}

interface LoginParams {
  email: string;
  password: string;
}

export interface RequestResponseData {
  email: {
    S: 'string';
  };
  name: {
    S: 'string';
  };
  uid: {
    S: 'string';
  };
  createdAt: {
    S: 'string';
  };
}

interface GroupData {
  id: {
    S: string;
  };
  name: {
    S: string;
  };
  createdAt: {
    S: string;
  };
  createdBy: {
    S: string;
  };
}

export interface ResponseGroupsData {
  Count: number;
  Items: GroupData[];
}

export interface Users {
  name: {
    S: string;
  };
  uid: {
    S: string;
  };
}

export interface ResponseConversationsData {
  Count: number;
  Items: ConversationData[];
}

export interface ConversationData {
  id: {
    S: string;
  };
  companionID: {
    S: string;
  };
}

export interface ResponseUsersData {
  Count: number;
  Items: Users[];
}

export interface GroupMessageData {
  authorID: {
    S: string;
  };
  message: {
    S: string;
  };
  createdAt: {
    S: string;
  };
}
export interface ResponseGroupMessagesData {
  Count: number;
  Items: GroupMessageData[];
}

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private readonly registerURL = 'registration';

  private readonly loginURL = 'login';

  private readonly profileURL = 'profile';

  private readonly logoutURL = 'logout';

  private readonly groupListURL = 'groups/list';

  private readonly groupCreateURL = 'groups/create';

  private readonly groupDeleteURL = 'groups/delete?';

  private readonly usersURL = 'users';

  private readonly conversationsURL = 'conversations/list';

  private readonly groupMessagesURL = 'groups/read?';

  constructor(private http: HttpClient) {}

  private getHeaders() {
    return new HttpHeaders({
      'rs-uid': localStorage.getItem('uid') || '',
      'rs-email': localStorage.getItem('email') || '',
      Authorization: localStorage.getItem('token') || ''
    });
  }

  public sendRegistrationRequest(userData: RegistrationParams) {
    return this.http.post(this.registerURL, userData, { observe: 'response' });
  }

  public sendLoginRequest(userData: LoginParams) {
    return this.http.post(this.loginURL, userData, { observe: 'response' });
  }

  public sendProfileRequest() {
    const headers = this.getHeaders();
    return this.http.get(this.profileURL, { headers });
  }

  public sendChangeNameRequest(name: string) {
    const headers = this.getHeaders();
    return this.http.put(
      this.profileURL,
      { name },
      {
        headers,
        observe: 'response'
      }
    );
  }

  public logoutRequest() {
    const headers = this.getHeaders();
    return this.http.delete(this.logoutURL, { headers, observe: 'response' });
  }

  public gesGroupsListRequest() {
    const headers = this.getHeaders();
    return this.http.get(this.groupListURL, { headers });
  }

  public sendCreateNewGroupRequest(name: string) {
    const headers = this.getHeaders();
    return this.http.post(
      this.groupCreateURL,
      { name },
      {
        headers,
        observe: 'response'
      }
    );
  }

  public sendDeleteGroupRequest(id: string) {
    const headers = this.getHeaders();
    const params: HttpParams = new HttpParams().set('groupID', id);

    return this.http.delete(this.groupDeleteURL, {
      headers,
      params,
      observe: 'response'
    });
  }

  public getMembersRequest() {
    const headers = this.getHeaders();
    return this.http.get(this.usersURL, { headers });
  }

  public getConversationsRequest() {
    const headers = this.getHeaders();
    return this.http.get(this.conversationsURL, { headers });
  }

  public getGroupMessages(id: string, since?: number) {
    const headers = this.getHeaders();
    const params: HttpParams = since
      ? new HttpParams().set('groupID', id).set('since', since)
      : new HttpParams().set('groupID', id);

    return this.http.get(this.groupMessagesURL, {
      headers,
      params,
      observe: 'response'
    });
  }
}
