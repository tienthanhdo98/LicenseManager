using System.Security.Cryptography;
using System.Text;
using System.Text.Json;

namespace Ultilities
{
    public static class LicenseSigner
    {
        public static string Issue(object payload, string privateKeyPkcs8Base64)
        {
            string json = JsonSerializer.Serialize(payload);
            byte[] payloadBytes = Encoding.UTF8.GetBytes(json);

            using var ecdsa = ECDsa.Create();
            ecdsa.ImportPkcs8PrivateKey(Convert.FromBase64String(privateKeyPkcs8Base64), out _);

            byte[] sig = ecdsa.SignData(payloadBytes, HashAlgorithmName.SHA256);

            return $"{Base64Url.Encode(payloadBytes)}.{Base64Url.Encode(sig)}";
        }
    }
}
