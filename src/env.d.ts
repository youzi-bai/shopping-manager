/// <reference types="@dcloudio/types" />

declare const uni: UniApp

interface UniApp {
  reLaunch(options: { url: string }): void
  navigateTo(options: { url: string }): void
  navigateBack(options?: { delta?: number }): void
  showToast(options: { title: string; icon?: string }): void
  getStorageSync(key: string): any
  setStorageSync(key: string, value: any): void
  chooseImage(options?: any): void
  chooseDate(options?: any): void
}