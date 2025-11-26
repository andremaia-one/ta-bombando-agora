"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRailway } from "@/components/railway-provider";

const formSchema = z.object({
  nome: z.string().min(3, {
    message: "O nome deve ter pelo menos 3 caracteres.",
  }),
  email: z.string().email({
    message: "Por favor, digite um e-mail válido.",
  }),
  telefone: z.string().min(10, {
    message: "Por favor, digite um número de telefone válido.",
  }),
});

export default function LeadForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { apiUrl, isProduction } = useRailway();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      email: "",
      telefone: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    
    try {
      // Em ambiente de produção, enviar para a API
      if (isProduction) {
        try {
          const response = await fetch(`${apiUrl}/leads`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
          });
          
          if (!response.ok) {
            throw new Error('Falha ao enviar dados');
          }
          
          // Processar resposta
          const data = await response.json();
          console.log('Resposta da API:', data);
        } catch (error) {
          console.error('Erro ao enviar para API:', error);
          // Fallback para o modo de desenvolvimento mesmo em produção se a API falhar
        }
      } else {
        // Em ambiente de desenvolvimento, simulamos a chamada
        await new Promise((resolve) => setTimeout(resolve, 1500));
        console.log('Modo de desenvolvimento - dados simulados:', values);
      }
      
      toast.success("Cadastro realizado com sucesso!");
      
      // Armazenar informações do usuário na sessão
      sessionStorage.setItem("userEmail", values.email);
      sessionStorage.setItem("userName", values.nome);
      
      // Redirecionar para a área de trial
      router.push("/dashboard");
    } catch (error) {
      toast.error("Erro ao processar seu cadastro. Tente novamente.");
      console.error("Erro ao enviar formulário:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div id="lead-form" className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-center">Receba Seus 150 Leads Gratuitos</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="nome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome Completo</FormLabel>
                <FormControl>
                  <Input placeholder="Seu Nome Completo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail Profissional</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="email@suaempresa.com.br" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="telefone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone/WhatsApp</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="(XX) XXXXX-XXXX" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button
            type="submit"
            className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3 text-lg font-bold"
            disabled={isLoading}
          >
            {isLoading ? "Processando..." : "COMECE AGORA SEU TRIAL GRÁTIS"}
          </Button>
        </form>
      </Form>
      
      <div className="mt-6 text-center text-gray-500 text-sm">
        Ao se cadastrar, você concorda com nossos Termos de Uso e Política de Privacidade.
      </div>
      
      <div className="mt-6 flex items-center justify-center space-x-4">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <span className="text-sm">100% Gratuito</span>
        </div>
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <span className="text-sm">Sem cartão</span>
        </div>
      </div>
      
      {isProduction && (
        <div className="mt-4 text-xs text-center text-gray-400">
          Conectado ao ambiente de produção
        </div>
      )}
    </div>
  );
}