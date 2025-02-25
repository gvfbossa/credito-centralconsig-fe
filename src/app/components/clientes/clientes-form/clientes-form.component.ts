import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { ClienteService } from '../../../services/cliente.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EnumsResponse } from '../../../models/enums-response.model';
import { Bancos } from '../../../models/bancos-response.model';

@Component({
  selector: 'app-clientes-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './clientes-form.component.html',
  styleUrl: './clientes-form.component.css'
})

export class ClientesFormComponent implements OnInit {

  //TODO - adicionar buscador automatico de CEP
  
  clienteForm!: FormGroup;

  enumSexo: string[] = [];
  enumEstados: string[] = [];
  enumEstadosCivis: string[] = [];
  enumOrgaosExpeditores: string[] = [];
  enumEmpregadores: string[] = [];
  enumEscolaridade: {value: string, label: string}[] = [];
  enumOrgaosPublicos: string[] = [];
  enumTiposContato: string[] = [];
  enumTiposReferencia: string[] = [];
  enumTiposResidencia: string[] = [];
  enumFundo: string[] = []

  bancos: Bancos[] = []

  convenios: any[] = []

  titulo: string = 'Cadastrar Cliente';

  isSectionOpen: { [key: string]: boolean } = {
    dadosPessoais: true,
    contato: true,
    endereco: true,
    dadosProfissionais: true,
    contaBancaria: true,
    referencia: true,
    observacoes: true,
    negativacao: true,
  };

  cpfParam: string | null = null; 

  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.inicializarFormulario();

    this.carregarEnums();
    this.carregarBancos()
    this.carregarConvenios()

    this.addContaBancaria()
    this.addContato()
    this.addEndereco()
    this.addDadosProfissionais()
    this.addReferencias()

    this.carregarClienteSeEdicao()
  }

  private inicializarFormulario(): void {
    this.clienteForm = this.fb.group({
      nomeCompleto: ['', Validators.required],
      cpf: ['', [Validators.required, Validators.pattern('[0-9]{11}')]],
      dataNascimento: ['', Validators.required],
      sexo: ['', Validators.required],
      estadoCivil: ['', Validators.required],
      escolaridade: ['', Validators.required],
      telefone: ['', Validators.required],
      celular: ['', Validators.required],
      email: ['', Validators.required],
      rg: this.fb.group({
        numero: ['', Validators.required],
        orgaoExpeditor: ['', Validators.required],
        estadoEmissor: ['', Validators.required],
        dataExpedicao: ['', Validators.required]
      }),
      nacionalidade: [''],
      nomeMae: ['', Validators.required],
      nomePai: [''],
      naturalidadeCidade: ['', Validators.required],
      naturalidadeEstado: ['', Validators.required],
      contatos: this.fb.array([]),
      enderecos: this.fb.array([]),
      dadosProfissionais: this.fb.array([]),
      referencias: this.fb.array([]),
      contasBancarias: this.fb.array([]),
      observacoes: ['', Validators.required],
      negativacao: this.fb.group({
        dataNegativacao: ['', Validators.required],
        bloqueado: [false, Validators.required],
        dataEnvioJuridico: ['', Validators.required],
      })
    });
  }

  private carregarContatos(contatos: any[]): void {
    const contatoFormArray = this.clienteForm.get('contatos') as FormArray;
    contatoFormArray.clear(); // Limpa os contatos antes de adicionar novos
  
    contatos.forEach(contato => {
      contatoFormArray.push(this.fb.group({
        nome: [contato.nome, Validators.required],
        telefone: [contato.telefone, Validators.required],
        tipoContato: [contato.tipoContato, Validators.required]
      }));
    });
  }
  
  private carregarEnderecos(enderecos: any[]): void {
    const enderecoFormArray = this.clienteForm.get('enderecos') as FormArray;
    enderecoFormArray.clear(); // Limpa a lista antes de adicionar novos
  
    enderecos.forEach(endereco => {
      enderecoFormArray.push(this.fb.group({
        cep: [endereco.cep || '', Validators.required],
        logradouro: [endereco.logradouro || '', Validators.required],
        numero: [endereco.numero || '', Validators.required],
        complemento: [endereco.complemento || ''],
        bairro: [endereco.bairro || '', Validators.required],
        cidade: [endereco.cidade || '', Validators.required],
        estado: [endereco.estado || '', Validators.required],
        tipoResidencia: [endereco.tipoResidencia || '', Validators.required],
        tempoResidencia: [endereco.tempoResidencia || '', Validators.required],
        cobranca: [endereco.cobranca || false]
      }));
    });
  }

  private carregarDadosProfissionais(dadosProfissionais: any[]): void {
    const dadosProfissionaisFormArray = this.clienteForm.get('dadosProfissionais') as FormArray;
    dadosProfissionaisFormArray.clear(); // Limpa a lista antes de adicionar novos

  
    dadosProfissionais.forEach(dadoProfissional => {
      dadosProfissionaisFormArray.push(this.fb.group({
        empresa: [dadoProfissional.empresa || '', Validators.required],
        profissao: dadoProfissional.profissao || ['', Validators.required],
        ocupacao: [dadoProfissional.ocupacao || '', Validators.required],
        salario: [dadoProfissional.salario || '', Validators.required],
        outrasRendas: [dadoProfissional.outrasRendas || '', Validators.required],
        outrasRendasDetalhes: [dadoProfissional.outrasRendasDetalhes || '', Validators.required],
        telefoneComercial: [dadoProfissional.telefoneComercial || '', Validators.required],
        dataAdmissao: [dadoProfissional.dataAdmissao || '', Validators.required],
      }));
    });
  }  

  private carregarReferencias(referencias: any[]): void {
    const referenciasFormArray = this.clienteForm.get('referencias') as FormArray;
    referenciasFormArray.clear(); // Limpa a lista antes de adicionar novos

  
    referencias.forEach(referencia => {
      referenciasFormArray.push(this.fb.group({
        nome: [referencia.nome || '', Validators.required],
        endereco: referencia.endereco || ['', Validators.required],
        telefone: [referencia.telefone || '', Validators.required], 
        tipoReferencia: [referencia.tipoReferencia || '', Validators.required],
      }));
    });
  }

  private carregarClienteSeEdicao(): void {
    this.cpfParam = this.route.snapshot.paramMap.get('cpf');
  
    if (this.cpfParam) {
      this.titulo = 'Editar Cliente';
      this.clienteService.getClienteByCpf(this.cpfParam).subscribe((response) => {
        if (response) {
          
          this.clienteForm.patchValue(response.cliente);
          
          this.carregarContasCliente(this.cpfParam)
          this.carregarContatos(response.cliente.contatos);
          this.carregarEnderecos(response.cliente.enderecos)
          this.carregarDadosProfissionais(response.cliente.dadosProfissionais)
          this.carregarReferencias(response.cliente.referencias)
        } else {
          console.log('Nenhum cliente encontrado para esse CPF');
        }
      });
    }
  }
  
  carregarContasCliente(clienteCpf: any): void {
    if (clienteCpf) {
      this.clienteService.getClienteByCpf(clienteCpf).subscribe((response) => {
        if (response) {
          const contasArray = this.clienteForm.get('contasBancarias') as FormArray;
          contasArray.clear()

          console.log(response.cliente.contasBancarias)

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
        }
      });
    }
  }
  
  selecionarBanco(event: any, index: number): void {
    const bancoSelecionado = this.bancos.find(b => b.code === event.target.value);    
    const contaBancariaFormArray = this.clienteForm.get('contasBancarias') as FormArray

    if (bancoSelecionado) {
      contaBancariaFormArray.at(index).patchValue({
        conta: {
          banco: {
            name: bancoSelecionado.name,
            code: bancoSelecionado.code
          }
        }
      })
    }
  }
  
  private carregarEnums(): void {
    this.clienteService.getEnums().subscribe(
      (enums : EnumsResponse) => {
        this.enumSexo = enums.sexos || [];
        this.enumEstados = enums.estadosBrasileiros || [];
        this.enumEstadosCivis = enums.estadosCivis || []
        this.enumOrgaosExpeditores = enums.orgaosExpeditores || [];
        this.enumEmpregadores = enums.empregadores || [];
        this.enumEscolaridade = (enums.escolaridade || []).map(e => ({
          value: e,
          label: e.replace(/ENSINO\s*/gi, '').replace(/_/g, ' ').trim()
        }));
        this.enumOrgaosPublicos = enums.orgaosPublicos || [];
        this.enumTiposContato = enums.tiposContato || [];
        this.enumTiposReferencia = enums.tiposReferencia || [];
        this.enumTiposResidencia = enums.tiposResidencia || []
        this.enumFundo = enums.fundo || []
      },
      (error) => {
        console.error('Erro ao buscar enums:', error);
      }
    );
  }

  private carregarBancos(): void {
    this.clienteService.getBancos().subscribe(
      (bancos : Bancos[]) => {
        this.bancos = (bancos || []).sort((a, b) => a.code.localeCompare(b.code))
      })
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

  selecionarConvenio(event: any, index: number): void {
    const convenioSelecionado = this.convenios.find(b => b.codigo === event.target.value);    
    const contaBancariaFormArray = this.clienteForm.get('contasBancarias') as FormArray

    if (convenioSelecionado) {
      contaBancariaFormArray.at(index).patchValue({
        conta: {
          convenio: {
            codigo: convenioSelecionado.codigo,
            descricao: convenioSelecionado.descricao
          }
        }
      })
    }
  }  

  toggleSection(section: string) {
    this.isSectionOpen[section] = !this.isSectionOpen[section];
  }

  get contasBancarias(): FormArray {
    return this.clienteForm.get('contasBancarias') as FormArray;
  }

  get contatosFormArray(): FormArray {
    return this.clienteForm.get('contatos') as FormArray;
  }
  
  get enderecosFormArray(): FormArray {
    return this.clienteForm.get('enderecos') as FormArray;
  }

  get dadosProfissionaisFormArray(): FormArray {
    return this.clienteForm.get('dadosProfissionais') as FormArray;
  }

  get referenciasFormArray(): FormArray {
    return this.clienteForm.get('referencias') as FormArray;
  }
  
  addContaBancaria(): void {
    const novaConta = this.fb.group({
      banco: ['', Validators.required],
      codigoConta: ['', Validators.required],
      agencia: ['', Validators.required],
      digitoAgencia: ['', Validators.required],
      contaCorrente: ['', Validators.required],
      digitoContaCorrente: ['', Validators.required],
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
      empregador:  ['', Validators.required],
      orgao:  ['', Validators.required],
    });
  
    this.contasBancarias.push(novaConta);
  }

  addDatasFechamento(): void {}

  addContato(): void {
    const novoContato = this.fb.group({
      nome: ['', Validators.required],
      telefone: ['', Validators.required],
      tipoContato: ['', Validators.required],
    })
    this.contatosFormArray.push(novoContato)
  }

  addEndereco(): void {
    const novoEndereco = this.fb.group({
      cep: ['', Validators.required],
        logradouro: ['', Validators.required],
        numero: ['', Validators.required],
        complemento: [''],
        bairro: ['', Validators.required],
        cidade: ['', Validators.required],
        estado: ['', Validators.required],
        tipoResidencia: ['', Validators.required],
        tempoResidencia: ['', Validators.required],
        cobranca: [false]
    })
    this.enderecosFormArray.push(novoEndereco)
  }

  addDadosProfissionais(): void {
    const novoDadosProfissionais = this.fb.group({
      empresa: ['', Validators.required],
      profissao: ['', Validators.required],
      ocupacao: ['', Validators.required],
      salario: ['', Validators.required],
      outrasRendas: ['', Validators.required],
      outrasRendasDetalhes: ['', Validators.required],
      telefoneComercial: ['', Validators.required],
      dataAdmissao: ['', Validators.required],
    })
    this.dadosProfissionaisFormArray.push(novoDadosProfissionais)
  }

  addReferencias(): void {
    const novaReferencia = this.fb.group({
      nome: ['', Validators.required],
      endereco: ['', Validators.required],
      telefone: ['', Validators.required], 
      tipoReferencia: ['', Validators.required],
    })
    this.referenciasFormArray.push(novaReferencia)
  }
  
  removerContaBancaria(index: number): void {
    this.contasBancarias.removeAt(index);
    delete this.isSectionOpen[index];
  }

  onSubmit(): void {
    //if (this.clienteForm.valid) {
      const cliente = this.clienteForm.value;
      //TODO - não ta salvando as mensagens de primeira, só ao atualizar....
      cliente.contasBancarias.forEach((conta: any) => {
        conta.banco = this.bancos.find(banco => conta.banco === banco.code)
        conta.convenio = this.convenios.find(convenio => conta.convenio == convenio.codigo)
        conta.mensagens = Array.isArray(conta.mensagens) ? conta.mensagens : [conta.mensagens]
        console.log('mensagens ', conta.mensagens)
      });
      
      if (this.cpfParam === null) {
        this.clienteService.salvarCliente(cliente).subscribe({
          next: (response) => {
            console.log('Cliente salvo com sucesso:', response);
            alert('Cliente cadastrado com sucesso!');
            this.clienteForm.reset();
            this.router.navigate(['/clientes']);
          },  
          error: (error) => {
            console.error('Erro ao salvar cliente:', error);
            alert('Erro ao cadastrar cliente. Tente novamente.');
          }
        })
      }
      else {
        this.clienteService.updateCliente(this.cpfParam, cliente).subscribe({
          next: (response) => {
            console.log('Cliente alterado com sucesso:', response);
            alert('Cliente alterado com sucesso!');
            this.clienteForm.reset();
            this.router.navigate(['/clientes']);
          },  
          error: (error) => {
            console.error('Erro ao alterar cliente:', error);
            alert('Erro ao alterar cliente. Tente novamente.');
          }
        })
      }
    //} else {
     // alert('Formulário inválido. Faltam dados a serem preenchidos');
    //}
  }
  

}