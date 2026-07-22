using System.Security.Cryptography;
using System.Text;

namespace VacationPlusNewAPI;

public class HashPasswordResult
{
    public string Salt { get; set; }
    public string Password { get; set; }
}

public class Hashing
{
    private const int keySize = 32;
    private const int iterations = 35000;
    private static HashAlgorithmName hashAlgorithm = HashAlgorithmName.SHA512;
    public static HashPasswordResult HashPassword (string password)
    {
        var salt = RandomNumberGenerator.GetBytes(keySize);

        var hash = Rfc2898DeriveBytes.Pbkdf2(
            Encoding.UTF8.GetBytes(password),
            salt,
            iterations,
            hashAlgorithm,
            keySize);

        var passwordHash = Convert.ToHexString(hash);

        HashPasswordResult result = new HashPasswordResult()
        {
            Password = Convert.ToHexString(hash),
            Salt = Convert.ToHexString(salt)
        };

        return result;
    }

    public static bool VerifyPassword(string password, string hash, byte[] salt)
    {
        var hashToCompare = Rfc2898DeriveBytes.Pbkdf2(password, salt, iterations, hashAlgorithm, keySize);
        return CryptographicOperations.FixedTimeEquals(hashToCompare, Convert.FromHexString(hash));
    }
}