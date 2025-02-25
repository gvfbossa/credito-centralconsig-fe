import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { ClienteService } from '../../../services/cliente.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Bancos } from '../../../models/bancos-response.model';
import { EnumsResponse } from '../../../models/enums-response.model';
import { ContaBancariaService } from '../../../services/conta-bancaria.service';
import { forkJoin } from 'rxjs';


@Component({
  selector: 'app-contas-bancarias-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
      CommonModule,
  ],
  templateUrl: './contas-bancarias-form.component.html',
  styleUrl: './contas-bancarias-form.component.css'
})
export class ContasBancariasFormComponent implements OnInit {
  contaForm!: FormGroup;

  titulo: string = 'Editar Contas Bancárias de ' ;
  nomeCliente: string = ''

  bancos: Bancos[] = []
  convenios: any[] = []
  enumEmpregadores: string[] = [];
  enumOrgaosPublicos: string[] = [];


  isSectionOpen: boolean[] = [];

  constructor(private fb: FormBuilder, private contaService: ContaBancariaService, private clienteService: ClienteService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.inicializarFormulario();
    this.addContaBancaria()
    this.carregarBancos()
    this.carregarConvenios()
    this.carregarEnums();
    this.carregarContasCliente()

    this.isSectionOpen = this.contasBancarias.controls.map(() => true);
  }
  
  private carregarBancos(): void {
    this.clienteService.getBancos().subscribe(
      (bancos : Bancos[]) => {
        this.bancos = (bancos || []).sort((a, b) => a.code.localeCompare(b.code))
      })
  }

  private inicializarFormulario(): void {
    this.contaForm = this.fb.group({
      contasBancarias: this.fb.array([]),
    })
  }

  get contasBancarias(): FormArray {
    return this.contaForm.get('contasBancarias') as FormArray;
  }

  private carregarConvenios(): void {
    this.clienteService.getConvenios().subscribe(
      (response: any[]) => {
        this.convenios = response.map(item => item.convenio);
      },
      (error) => {
        console.error('Erro ao carregar convênios:', error);
      }
    );
  }

  private carregarEnums(): void {
      this.clienteService.getEnums().subscribe(
        (enums : EnumsResponse) => {
          this.enumEmpregadores = enums.empregadores || [];
          this.enumOrgaosPublicos = enums.orgaosPublicos || [];
        },
        (error) => {
          console.error('Erro ao buscar enums:', error);
        }
    );
  }
  
  addContaBancaria(): void {
    const novaConta = this.fb.group({
      banco: ['', Validators.required],
      agencia: ['', Validators.required],
      digitoAgencia: ['', Validators.required],
      contaCorrente: ['', Validators.required],
      digitoContaCorrente: ['', Validators.required],
      codigoConta: ['', Validators.required],
      identificadorEspecial: ['', Validators.required],
      operacao: ['', Validators.required],
      codigoCedente: ['', Validators.required], 
      digitoCodigoCedente: ['', Validators.required],
      nossoNumero: ['', Validators.required],
      carteira: ['', Validators.required],
      localPagamento: ['', Validators.required],
      fundo: ['', Validators.required],
      mensagens: ['', Validators.required],
      contaCobranca: [false],
      protestar: [false],
      diasParaProtesto: ['', Validators.required],
      convenio: ['', Validators.required],
      empregador: ['', Validators.required],
      orgao: ['', Validators.required],
    });
  
    this.contasBancarias.push(novaConta);
  }

  carregarContasCliente(): void {
    const clienteCpf = this.route.snapshot.paramMap.get('cpf');

    if (clienteCpf) {
      this.clienteService.getClienteByCpf(clienteCpf).subscribe((response) => {
        if (response) {
          this.contaForm.patchValue({
            nomeCompleto: response.cliente.nomeCompleto
          });

          // Atualiza as contas bancárias
          const contasArray = this.contaForm.get('contasBancarias') as FormArray;
          contasArray.clear(); // Limpa antes de adicionar novas contas 

          response.cliente.contasBancarias.forEach((conta: { banco: any; codigoConta: any; agencia: any; digitoAgencia: any; contaCorrente: any; digitoContaCorrente: any; identificadorEspecial: any; operacao: any; codigoCedente: any; digitoCodigoCedente: any; nossoNumero: any; carteira: any; localPagamento: any; fundo: any; mensagens: any; contaCobranca: any; protestar: any; diasParaProtesto: any; empregador: any; orgao: any; convenio: any }) => {
            contasArray.push(this.fb.group({
              banco: [conta.banco.code],
              agencia: [conta.agencia],
              digitoAgencia: [conta.digitoAgencia],
              contaCorrente: [conta.contaCorrente],
              digitoContaCorrente: [conta.digitoContaCorrente], 
              codigoConta: [conta.codigoConta],
              identificadorEspecial: [conta.identificadorEspecial],
              operacao: [conta.operacao],
              codigoCedente: [conta.codigoCedente],
              digitoCodigoCedente: [conta.digitoCodigoCedente],
              nossoNumero: [conta.nossoNumero],
              carteira: [conta.carteira],
              localPagamento: [conta.localPagamento],
              fundo: [conta.fundo],
              mensagens: [conta.mensagens],
              contaCobranca: [conta.contaCobranca],
              protestar: [conta.protestar],
              diasParaProtesto: [conta.diasParaProtesto],
              empregador: [conta.empregador],
              orgao: [conta.orgao],
              convenio: [conta.convenio.codigo]
            }));
          });
          this.nomeCliente = response.cliente.nomeCompleto
        }
      });
    }
  }  
  
  removerContaBancaria(index: number): void {
    const conta = this.contasBancarias.at(index).value;

    const confirmacao = confirm('Tem certeza que deseja remover a conta?');
    
    if (confirmacao) {
      conta.banco = this.bancos.find(banco => conta.banco === banco.code);
      conta.convenio = this.convenios.find(convenio => conta.convenio == convenio.codigo);
      conta.mensagens = Array.isArray(conta.mensagens) ? conta.mensagens : [conta.mensagens];

      this.contaService.removeConta(conta).subscribe({
        next: (response) => {
          console.log('Conta removida com sucesso:', response);
          this.contasBancarias.removeAt(index);
          alert('Conta removida com sucesso!');
        },
        error: (error) => {
          console.error('Erro ao remover conta:', error);
          alert('Erro ao remover conta. Tente novamente.');
        }
      });
    }
  }

  toggleSectionArray(index: number): void {
    this.isSectionOpen[index] = !this.isSectionOpen[index];
  }  

  onSubmit() {
    const cpfParam = this.route.snapshot.paramMap.get('cpf');
    if (cpfParam !== null) {
      const cliente = this.contaForm.value;
      
      cliente.contasBancarias.forEach((conta: any) => {
        conta.banco = this.bancos.find(banco => conta.banco === banco.code);
        conta.convenio = this.convenios.find(convenio => conta.convenio == convenio.codigo);
        conta.mensagens = Array.isArray(conta.mensagens) ? conta.mensagens : [conta.mensagens];
      });
  
      this.contaService.syncContas(cpfParam, cliente.contasBancarias).subscribe({
        next: (response) => {
          console.log('Contas sincronizadas com sucesso:', response);
          alert('Contas editadas com sucesso!');
          this.contaForm.reset();
          this.router.navigate(['/contas-bancarias']);
        },
        error: (error) => {
          console.error('Erro ao editar contas:', error);
          alert('Erro ao sincronizar contas. Tente novamente.');
        }
      });
    }
  }  

}
