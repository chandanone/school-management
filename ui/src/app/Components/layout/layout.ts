import { Component, inject } from '@angular/core';
import { Header } from '../header/header';
import { Sidebar } from '../sidebar/sidebar';
import { Footer } from '../footer/footer';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, Header, Sidebar, Footer],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {}
