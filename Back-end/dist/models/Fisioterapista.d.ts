declare class Fisioterapista {
    static register(nome: string, cognome: string, email: string, password: string): Promise<string>;
    static login(email: string, password: string): Promise<string>;
    static getPazientiByFisioterapistaJWT(fisioterapistaJWT: string): Promise<any[]>;
}
export default Fisioterapista;
