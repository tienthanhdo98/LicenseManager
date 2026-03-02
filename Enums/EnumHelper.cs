using System.ComponentModel.DataAnnotations;

namespace Enums
{
    public static class EnumHelper
    {
        public static List<EnumValue> GetValues<T>() where T : Enum
        {
            return Enum.GetValues(typeof(T))
                .Cast<T>()
                .Where(e => !e.ToString().Equals("NONE"))
                .Select(e => new EnumValue
                {
                    Value = Convert.ToInt32(e),
                    Text = GetDisplayName(e)
                })
                .ToList();
        }
        public static string GetDisplayName(this Enum enumValue)
        {
            var displayAttribute = enumValue.GetType()
                .GetField(enumValue.ToString())
                .GetCustomAttributes(typeof(DisplayAttribute), false)
                .FirstOrDefault() as DisplayAttribute;

            return displayAttribute?.Name ?? enumValue.ToString();
        }
        public class EnumValue
        {
            public int Value { get; set; }
            public string Text { get; set; } = string.Empty;
        }
    }
}
