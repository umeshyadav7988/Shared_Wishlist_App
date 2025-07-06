import io, { Socket } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

class SocketService {
  private socket: Socket | null = null;

  connect(token: string): void {
    if (this.socket) {
      this.socket.disconnect();
    }

    this.socket = io(SOCKET_URL, {
      auth: {
        token: token,
      },
    });

    this.socket.on('connect', () => {
      console.log('Connected to server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinWishlist(wishlistId: string): void {
    if (this.socket) {
      this.socket.emit('join-wishlist', wishlistId);
    }
  }

  leaveWishlist(wishlistId: string): void {
    if (this.socket) {
      this.socket.emit('leave-wishlist', wishlistId);
    }
  }

  emitProductAdded(data: any): void {
    if (this.socket) {
      this.socket.emit('product-added', data);
    }
  }

  emitProductUpdated(data: any): void {
    if (this.socket) {
      this.socket.emit('product-updated', data);
    }
  }

  emitProductRemoved(data: any): void {
    if (this.socket) {
      this.socket.emit('product-removed', data);
    }
  }

  emitWishlistUpdated(data: any): void {
    if (this.socket) {
      this.socket.emit('wishlist-updated', data);
    }
  }

  onProductAdded(callback: (data: any) => void): void {
    if (this.socket) {
      this.socket.on('product-added', callback);
    }
  }

  onProductUpdated(callback: (data: any) => void): void {
    if (this.socket) {
      this.socket.on('product-updated', callback);
    }
  }

  onProductRemoved(callback: (data: any) => void): void {
    if (this.socket) {
      this.socket.on('product-removed', callback);
    }
  }

  onWishlistUpdated(callback: (data: any) => void): void {
    if (this.socket) {
      this.socket.on('wishlist-updated', callback);
    }
  }

  offProductAdded(callback: (data: any) => void): void {
    if (this.socket) {
      this.socket.off('product-added', callback);
    }
  }

  offProductUpdated(callback: (data: any) => void): void {
    if (this.socket) {
      this.socket.off('product-updated', callback);
    }
  }

  offProductRemoved(callback: (data: any) => void): void {
    if (this.socket) {
      this.socket.off('product-removed', callback);
    }
  }

  offWishlistUpdated(callback: (data: any) => void): void {
    if (this.socket) {
      this.socket.off('wishlist-updated', callback);
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export default new SocketService();
