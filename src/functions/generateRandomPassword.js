function generateRandomPassword() {
    const lowercaseLetters = 'abcdefghijklmnopqrstuvwxyz';
    const uppercaseLetters = lowercaseLetters.toUpperCase();
    const numbers = '0123456789';
    const specialCharacters = '!@#$%^&*()_-+=<>?';

    const allCharacters = lowercaseLetters + uppercaseLetters + numbers + specialCharacters;

    let password = '';
    for (let i = 0; i < 8; i++) {
        const randomIndex = Math.floor(Math.random() * allCharacters.length);
        password += allCharacters.charAt(randomIndex);
    }

    return password;
}

module.exports = generateRandomPassword();