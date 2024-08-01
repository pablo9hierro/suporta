const SellerForm = () => {
    return (
      <form>
        <h2>Criar Vendedor</h2>
        <label>
          Data de Trabalho:
          <input type="date" name="data_de_trabalho" />
        </label>
        <label>
          Nome:
          <input type="text" name="nome" />
        </label>
        <label>
          Telefone:
          <input type="text" name="telefone" />
        </label>
        <label>
          Idade:
          <input type="number" name="idade" />
        </label>
        <label>
          Qtd_10 (Quantidade de mercadorias de 10 reais):
          <input type="number" name="qtd_10" />
        </label>
        <label>
          Qtd_15 (Quantidade de mercadorias de 15 reais):
          <input type="number" name="qtd_15" />
        </label>
        <label>
          Localização (geolocalização):
          <input type="text" name="localizacao" />
        </label>
        <label>
          Comissão de Venda na Venda de Qtd_10:
          <input type="number" name="comissao_qtd_10" />
        </label>
        <label>
          Comissão de Venda na Venda de Qtd_15:
          <input type="number" name="comissao_qtd_15" />
        </label>
        <label>
          Trabalhando:
          <input type="checkbox" name="trabalhando" />
        </label>
        <label>
          Qtd_Vendas:
          <input type="number" name="qtd_vendas" />
        </label>
        <label>
          Saldo:
          <input type="number" name="saldo" />
        </label>
        <button type="submit">Registrar</button>
      </form>
    );
  };
  
  export default SellerForm;
  