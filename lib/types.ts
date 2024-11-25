
export interface User {
    id: number;
    name: string;
    email: string;
    nickname: string;
  }
  
  export interface Room {
    Roomname: string;
    id: number;
    name: string;
    is_private: boolean;
    password?: string;
    created_by: number;
    people_count: number; 
  }

  export type CreateRoomResponse = {
    room_id?: number;
    error?: string;
  };
  