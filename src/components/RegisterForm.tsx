import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

interface IFormInput {
  Login: string; // Alterado de 'email' para 'Login'
  Senha: string; // Alterado de 'password' para 'Senha'
}

interface RegisterFormProps {
  handleShowHome: () => void; // Apenas handleShowHome
}

const RegisterForm: React.FC<RegisterFormProps> = ({ handleShowHome }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();

  const onSubmit = async (data: IFormInput) => {
    try {
      const response = await axios.post(
        "http://192.168.224.128:80/mid/register",
        data
      );
      console.log("Registration successful:", response.data);
      handleShowHome(); // Redirecionar após o registro bem-sucedido
    } catch (error) {
      console.error("Error registering:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form-container">
      <label>Usuário</label>
      <input type="text" {...register("Login", { required: true })} />
      {errors.Login && <p>Campo Necessário!</p>}

      <label>Senha</label>
      <input type="password" {...register("Senha", { required: true })} />
      {errors.Senha && <p>Campo Necessário!</p>}

      <input type="submit" value="Criar Conta" />
      <button type="button" onClick={handleShowHome}>
        Voltar
      </button>
    </form>
  );
};

export default RegisterForm;
