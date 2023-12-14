import React, { useState, useEffect } from 'react';
import './abc.css';

interface Product {
  id: string;
  interest: number;
  name: string;
  min_amount: number;
  max_amount: number;
  min_tenure: number;
  max_tenure: number;
  image: string;
}

const LoanCalculator: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined);
  const [loanAmount, setLoanAmount] = useState<string>('');
  const [months, setMonths] = useState<number | ''>('');
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [monthlyInstallment, setMonthlyInstallment] = useState<number>(0);
  const [targetMonth, setTargetMonth] = useState<number | ''>('');

  useEffect(() => {
    fetch('/products.json')
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
        if (data.length > 0) {
          setSelectedProduct(data[0]);
        }
      });
  }, []);

  const handleProductChange = (product: Product) => {
    setSelectedProduct(product);
    setLoanAmount('');
    setMonths('');
  };

  const handleLoanAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = parseFloat(e.target.value.replace(/[^0-9.]/g, '')) || 0;
    
    const clampedAmount = Math.min(selectedProduct?.max_amount || amount, Math.max(selectedProduct?.min_amount || amount, amount));
  
    setLoanAmount(clampedAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
  };
  const handleMonthsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const months = parseInt(e.target.value.replace(/[^0-9]/g, ''), 10) || '';
    setMonths(months);
  };

  useEffect(() => {
    if (selectedProduct && loanAmount && months !== '') {
      const interest = selectedProduct.interest / 100;
      const totalAmount = parseFloat(loanAmount) + parseFloat(loanAmount) * interest;
      const monthlyInstallment = totalAmount / (months as number);
      const targetMonth = new Date().getMonth() + (months as number);

      setTotalAmount(totalAmount);
      setMonthlyInstallment(monthlyInstallment);
      setTargetMonth(targetMonth);
    }
  }, [selectedProduct, loanAmount, months]);

  return (
  
    <div className="loan-calculator-card">
      <div className="Title">
  <div className="TypographySubtitleLgSemiboldHighemphasis">
    <span className="TitleText">Let's plan your </span>
    <span className="TitleTextBold">loan</span>
    <span className="TitleText">.</span>
  </div>
</div>
      <div className="custom-dropdown">
       
        <div className="product-options" id="product-options">
          {products.map((product) => (
            <img
              key={product.id}
              className="product-option"
              src={product.image}
              alt={product.name}
              onClick={() => handleProductChange(product)}
            />
          ))}
        </div>
      </div>
      {selectedProduct && (
  <div className="amount-and-months">
   <div className="loan-amount">


  <div className="TypographyDescriptionLgHighemphasis loan-description">
  <div className="TypographyDescriptionLgHighemphasisText">Loan amount</div>
 
    <div className="currency-group">
      <span className="currency-symbol">$</span>
      <input
        type="text"
        placeholder="Loan Amount"
        value={loanAmount}
        onChange={handleLoanAmountChange}
        className="loan-input"
      />
    </div>
  </div>
  
  <div className="TypographyDescriptionLgHighemphasis loan-description">
    <div className="TypographyDescriptionLgHighemphasisText">Number of Months</div>
    <div className="month-input">
      <button className="decrement" onClick={() => setMonths((prev) => (prev === '' || prev <= 1 ? '' : prev - 1))}>
        {'<'}
      </button>
      <input
        type="number"
        placeholder="Number of Months"
        value={months}
        onChange={handleMonthsChange}
        className="month-input-field"
      />
      <button className="increment" onClick={() => setMonths((prev) => (prev === '' ? 1 : prev + 1))}>
        {'>'}
      </button>
    </div>
  </div>
</div>
</div>

)}


{selectedProduct && (
  <div>
    <div className="monthly-amount-section">
      <div className="monthly-amount-label">
        Monthly amount
      </div>
      <div className="monthly-amount-value">
        $ {monthlyInstallment.toFixed(3)}
      </div>
    </div>


    <div className="GrayBg"></div>
      <div className="Breakdown">
        <div className="TypographyCaptionHighemphasis">
          <span>You’re planning {months}</span>
          <span className="bold"> monthly deposits</span>
          <span> to reach your </span>
          <span className="extra-bold">${loanAmount}</span>
          <span> goal by </span>
          <span className="extra-bold">
            {new Date().toLocaleString('en-us', { month: 'long' })} {new Date().getFullYear()}.
          </span>
          <span> The total amount loaned will be </span>
          <span className="extra-bold">${totalAmount.toFixed(3)}</span>
        </div>
      </div>
    <div id="confirm-button">Apply Now</div>
  </div>
)}

    </div>
  );
  
  
};

export default LoanCalculator;
