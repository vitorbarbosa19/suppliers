import React, { useMemo } from 'react';
import Button from '@bit/vitorbarbosa19.ziro.button';
import currencyFormat from '@ziro/currency-format';
import { summaryCardContainer, summaryCardInfo, summaryBlock, priceLabel, description, stock, stockGrid, stockLabel, stockQty, infoCardLabel, button } from '../styles_catalog';


export default ({ image, product, setEditing }) => {
  return (
    <div style={summaryCardContainer}>
      {image}
      <div style={summaryCardInfo}>
        {product.description ? (
          <div style={summaryBlock}>
            <label style={priceLabel}>Descrição</label>
            <label style={description}>{product.description}</label>
          </div>
        ) : null}
        <div style={summaryBlock}>
          <label style={priceLabel}>Preço</label>
          <label>{currencyFormat(product.price)}</label>
        </div>
        <div style={summaryBlock}>
          <label style={priceLabel}>Referência</label>
          <label>{product?.referenceId || '-'}</label>
        </div>
        <div>
          <label style={priceLabel}>Variações cadastradas</label>
          <div style={stock}>
            {Object.keys(product.availableQuantities || {}).length ? (
              Object.entries(product.availableQuantities).map(([key, qty]) => (
                <div key={key} style={stockGrid}>
                  <label style={stockLabel}>{`${key}`}</label>
                  <label style={stockQty}>{qty}</label>
                </div>
              ))
            ) : (
              <div>
                <label style={infoCardLabel}>nenhuma variação</label>
              </div>
            )}
          </div>
        </div>
        {Object.keys(product.requestedQuantities).length ? (
          <div style={summaryBlock}>
            <label style={priceLabel}>Total a pagar</label>
            <label>
              {currencyFormat(
                Object.entries(product.requestedQuantities)
                  .map(([key, qty]) => product.price * qty)
                  .reduce((acc, curr) => acc + curr),
              )}
            </label>
          </div>
        ) : null}
        <Button style={button} type="button" cta="Editar" click={() => setEditing(true)} />
      </div>
    </div>
  );
};
