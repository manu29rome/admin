import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    NgChartsModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export default class DashboardComponent {
  activeTab: string = 'usuarios';
  currentView: 'companies' | 'users' | 'clients' | 'tickets' = 'companies';
  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
    }
  };

  barChartLabels: string[] = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul'];
  barChartData = {
    labels: this.barChartLabels,
    datasets: [
      { label: 'Ventas', data: [5000, 7000, 4000, 9000, 11000, 9500, 12000], backgroundColor: '#60a5fa' }
    ]
  };

  pieChartLabels: string[] = ['Minorista', 'Mayorista', 'Corporativo'];
  pieChartData = {
    labels: this.pieChartLabels,
    datasets: [
      {
        data: [300, 450, 500],
        backgroundColor: ['#34d399', '#fbbf24', '#60a5fa']
      }
    ]
  };

  lineChartLabels: string[] = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul'];
  lineChartData = {
    labels: this.lineChartLabels,
    datasets: [
      {
        data: [50, 60, 70, 65, 80, 90, 100],
        label: 'Crecimiento %',
        fill: false,
        borderColor: '#8b5cf6',
        tension: 0.4
      }
    ]
  };

  dataTable = [
    { id: 1, name: 'Empresa A', category: 'Minorista', date: '2025-08-01', status: 'Activo' },
    { id: 2, name: 'Empresa B', category: 'Mayorista', date: '2025-08-02', status: 'Inactivo' },
    { id: 3, name: 'Empresa C', category: 'Corporativo', date: '2025-08-03', status: 'Activo' },
    { id: 4, name: 'Empresa D', category: 'Corporativo', date: '2025-08-04', status: 'Activo' },
    { id: 5, name: 'Empresa E', category: 'Minorista', date: '2025-08-05', status: 'Inactivo' },
  ];

  menuItems = ['Compañías', 'Usuarios', 'Clientes', 'Tickets'];

  // Gráfica de Compañías (Bar Chart)
  companyChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Empresa A', 'Empresa B', 'Empresa C'],
    datasets: [
      { data: [45, 67, 30], label: 'Compañías activas' }
    ]
  };

  // Gráfica de Usuarios (Pie Chart)
  userChartData: ChartConfiguration<'pie'>['data'] = {
    labels: ['Activos', 'Inactivos', 'Suspendidos'],
    datasets: [
      { data: [120, 45, 15] }
    ]
  };

  // Gráfica de Clientes (Line Chart)
  clientChartData: ChartConfiguration<'line'>['data'] = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May'],
    datasets: [
      { data: [150, 180, 200, 170, 210], label: 'Nuevos clientes' }
    ]
  };

  // Gráfica de Tickets (Bar Chart)
  ticketChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Abiertos', 'En Proceso', 'Resueltos', 'Cerrados'],
    datasets: [
      { data: [30, 50, 100, 80], label: 'Tickets' }
    ]
  };

  // Gráfica de Donut (Doughnut Chart)
  doughnutChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: ['Soporte', 'Ventas', 'Otros'],
    datasets: [
      {
        data: [100, 60, 40]
      }
    ]
  };
  doughnutChartLabels = ['Soporte', 'Ventas', 'Otros'];

  // Gráfica de Radar
  radarChartData: ChartConfiguration<'radar'>['data'] = {
    labels: ['Velocidad', 'Calidad', 'Satisfacción', 'Tiempo Respuesta'],
    datasets: [
      {
        label: 'Indicadores',
        data: [80, 70, 90, 60]
      }
    ]
  };
  radarChartLabels = ['Velocidad', 'Calidad', 'Satisfacción', 'Tiempo Respuesta'];

  changeView(view: 'companies' | 'users' | 'clients' | 'tickets') {
    this.currentView = view;
  }
}