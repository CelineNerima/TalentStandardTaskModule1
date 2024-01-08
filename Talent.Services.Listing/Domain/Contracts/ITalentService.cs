using System.Collections.Generic;
using System.Threading.Tasks;

namespace Talent.Services.Talent.Domain.Contracts
{
    public interface ITalentService
    {
        Task<IEnumerable<string>> GetTalentWatchlistIds(string employerId);

        Task SetWatchingTalent(string employerId, string talentId, bool isWatching);
    }
}
