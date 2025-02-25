import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { ConvenioService } from '../../../services/convenio.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-convenios-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
      CommonModule,
  ],
  templateUrl: './convenios-form.component.html',
  styleUrl: './convenios-form.component.css'
})

export class ConveniosFormComponent implements OnInit {
  convenioForm!: FormGroup;
  titulo: string = 'Cadastrar Convênio';
  
  isSectionOpen: { [key: string]: boolean } = {
    dadosConvenio: true,
    datasFechamento: true,
  };

  constructor(
    private fb: FormBuilder,
    private convenioService: ConvenioService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.inicializarFormulario();
    this.carregarConvenioSeEdicao()
  }

  private inicializarFormulario(): void {
    this.convenioForm = this.fb.group({
      codigo: ['', Validators.required],
      descricao: ['', Validators.required],
      descricaoEmpregador: ['', Validators.required], 
      descricaoOrgao: ['', Validators.required],
      fechamento: ['', Validators.required],
      vencimento: ['', Validators.required],
      dataFechamentoConvenios: this.fb.array([]),
    });
  }

  get dataFechamentoConvenios(): FormArray {
    return this.convenioForm.get('dataFechamentoConvenios') as FormArray;
  }
  
  // Retorna um FormArray específico dentro de um conjunto
  getMeses(conjuntoIndex: number): FormArray {
    return this.dataFechamentoConvenios.at(conjuntoIndex).get('meses') as FormArray;
  }
  
  addConjuntoDatas(): void {
    const index = this.dataFechamentoConvenios.length; // Obtém o próximo índice

    const novoConjunto = this.fb.group({
      meses: this.fb.array([]) // Criamos o array de meses
    });
  
    const mesesArray = novoConjunto.get('meses') as FormArray;
  
    // Adicionamos os 12 meses dentro do mesmo conjunto
    for (let i = 0; i < 12; i++) {
      mesesArray.push(
        this.fb.group({
          data: ['', Validators.required],
          diaEnvio: ['', [Validators.required, Validators.min(1), Validators.max(31)]],
        })
      );
    }
  
    this.dataFechamentoConvenios.push(novoConjunto);
    this.isSectionOpen['datasFechamento' + index] = true;
  }  
  
  removerConjuntoDatas(index: number): void {
    this.dataFechamentoConvenios.removeAt(index);
  }

  getMesesArray(conjunto: AbstractControl): FormArray {
    return conjunto.get('meses') as FormArray;
  }  

  private carregarConvenioSeEdicao(): void {
    const idParam = this.route.snapshot.paramMap.get('codigo');
    if (idParam) {
      const codigoConvenio = Number(idParam);
      if (!isNaN(codigoConvenio)) {
        this.titulo = 'Editar Convênio';
        this.convenioService.getConvenioByCodigo(codigoConvenio).subscribe((response) => {
          if (response) {
            const convenio = response.convenio;
            console.log(convenio);
            this.convenioForm.patchValue(convenio);
      
            if (convenio.dataFechamentoConvenios && convenio.dataFechamentoConvenios.length > 0) {
              this.dataFechamentoConvenios.clear();
            
              // Mapa para agrupar os meses por ano
              const agrupadosPorAno = new Map<number, any[]>();
            
              convenio.dataFechamentoConvenios.forEach((dataFechamento: any) => {
                const data = dataFechamento.data; // Exemplo: "2024-03-10"
                const ano = parseInt(data.slice(0, 4), 10); // Converte "2024" para número
                const mesFormatado = {
                  data: data,
                  diaEnvio: dataFechamento.diaEnvio
                };
            
                // Se o ano ainda não existir no Map, criamos um novo array para ele
                if (!agrupadosPorAno.has(ano)) {
                  agrupadosPorAno.set(ano, []);
                }
            
                // Adicionamos o mês ao grupo correspondente ao ano
                agrupadosPorAno.get(ano)?.push(mesFormatado);
              });
            
              // Criar os conjuntos com os meses agrupados por ano
              agrupadosPorAno.forEach((meses, ano) => {
                const mesesArray = this.fb.array([] as FormGroup[]); // FormArray de FormGroups
            
                // Todos os meses do ano
                const mesesDoAno = [
                  { mes: '01', data: '', diaEnvio: null },
                  { mes: '02', data: '', diaEnvio: null },
                  { mes: '03', data: '', diaEnvio: null },
                  { mes: '04', data: '', diaEnvio: null },
                  { mes: '05', data: '', diaEnvio: null },
                  { mes: '06', data: '', diaEnvio: null },
                  { mes: '07', data: '', diaEnvio: null },
                  { mes: '08', data: '', diaEnvio: null },
                  { mes: '09', data: '', diaEnvio: null },
                  { mes: '10', data: '', diaEnvio: null },
                  { mes: '11', data: '', diaEnvio: null },
                  { mes: '12', data: '', diaEnvio: null }
                ];
            
                // Preenche o FormArray com os dados do mês ou valores vazios
                mesesDoAno.forEach((mesInfo) => {
                  const mesExistente = meses.find(m => m.data.slice(5, 7) === mesInfo.mes);
            
                  const data = mesExistente ? mesExistente.data : mesInfo.data;
                  const diaEnvio = mesExistente ? mesExistente.diaEnvio : mesInfo.diaEnvio;
            
                  mesesArray.push(
                    this.fb.group({
                      data: [data, Validators.required],
                      diaEnvio: [diaEnvio, [Validators.required, Validators.min(1), Validators.max(31)]],
                    })
                  );
                });
            
                const novoConjunto = this.fb.group({
                  ano: [ano], // Adicionamos o ano ao conjunto
                  meses: mesesArray // Agora o mesesArray está correto!
                });
            
                this.dataFechamentoConvenios.push(novoConjunto);
              });
            }                        
          }
        });
      }      
    } else {
      // Apenas adiciona um único conjunto com 12 meses
      this.addConjuntoDatas();
    }
  }
  

  addDataFechamento(qtde: number): void {
    for (let i = 0; i < qtde; i++) {
      const dataFechamentoGroup = this.fb.group({
        data: ['', Validators.required],  // Data obrigatória
        diaEnvio: ['', [Validators.required, Validators.min(1), Validators.max(31)]]  // Dia de envio obrigatório, entre 1 e 31
      });
      this.dataFechamentoConvenios.push(dataFechamentoGroup);
    }
  }

  removerDataFechamento(index: number): void {
    this.dataFechamentoConvenios.removeAt(index);
  }

  onSubmit(): void {  
    const codigoparam = this.route.snapshot.paramMap.get('codigo')
    //if (this.convenioForm.valid) {
      // Cria o objeto a ser enviado
      const codigo = this.convenioForm.value.codigo
      const convenioRequest = {
        codigo: this.convenioForm.value.codigo,
        descricao: this.convenioForm.value.descricao,
        descricaoEmpregador: this.convenioForm.value.descricaoEmpregador,
        descricaoOrgao: this.convenioForm.value.descricaoOrgao,
        fechamento: this.convenioForm.value.fechamento,
        vencimento: this.convenioForm.value.vencimento,
        dataFechamentoConvenios: this.convenioForm.value.dataFechamentoConvenios.flatMap((item: any) => 
          item.meses.map((mes: any) => ({
            data: mes.data ? new Date(mes.data).toISOString().split('T')[0] : null, // Formata para ISO se existir
            diaEnvio: mes.diaEnvio !== null ? mes.diaEnvio : null // Garante que diaEnvio seja null se não estiver preenchido
          }))
        )
      };

      if (!codigoparam) {
        this.convenioService.salvarConvenio(convenioRequest).subscribe({
          next: (response) => {
            console.log('Convênio salvo com sucesso:', response);
            alert('Convênio salvo com sucesso')
            this.redirectCasoSucesso()
            
          },
          error: (error) => {
            alert('Erro ao salvar Convênio')
            console.error('Erro ao salvar convênio:', error);
          }
        });
      }
      else {
        this.convenioService.atualizarConvenio(convenioRequest).subscribe({
          next: (response) => {
            console.log('Convênio atualizado com sucesso:', response);
            alert('Convênio atualizado com sucesso!')
            this.redirectCasoSucesso()
          },
          error: (error) => {
            alert('Erro ao atualizar Convênio')
            console.error('Erro ao atualizar convênio:', error);
          }
        });
      }
      
    //} else {
    //  console.log('Formulário inválido, não foi possível salvar.');
      // Aqui você pode adicionar lógica para mostrar mensagens de erro no formulário
    //}
  }  

  toggleSection(section: string) {
    this.isSectionOpen[section] = !this.isSectionOpen[section];
  }

  getMes(index: number): string {
    const meses = [
      'JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO',
      'JULHO', 'AGOSTO', 'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO'
    ];
    return meses[index];
  }

  getMesesEmGrupos(conjunto: AbstractControl): any[][] {
    const mesesArray = this.getMesesArray(conjunto).controls;
    const grupos = [];
  
    for (let i = 0; i < mesesArray.length; i += 3) {
      grupos.push(mesesArray.slice(i, i + 3));
    }
  
    return grupos;
  }

  redirectCasoSucesso(): void {
    this.convenioForm.reset()
    this.router.navigate(['/convenios'])
  }

}